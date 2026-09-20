# Bug: Mất phiên đăng nhập khi F5 (401 "No refresh token")

## Hiện tượng

Sau khi đăng nhập thành công vào Admin, chỉ cần **F5 (reload trang)** là bị văng ra login, dù chưa hết hạn phiên. Request `POST /auth/refresh` trả về:

```json
{ "message": "No refresh token", "error": "Unauthorized", "statusCode": 401 }
```

## Môi trường

- Frontend (Admin): `http://localhost:5173` (dev) — production sẽ deploy ở domain khác, cũng khác domain với backend.
- Backend API: `https://japanesestorebe.onrender.com/api`
- Đây là **hai origin khác nhau** (khác domain/subdomain) → mọi request giữa FE và BE đều là **cross-site**.

## Nguyên nhân

Access token của FE chỉ giữ trong memory (không lưu localStorage) để tránh XSS đánh cắp token. Khi reload trang, memory bị xoá sạch, FE gọi `POST /auth/refresh` dựa vào cookie `refresh_token` (httpOnly) để lấy lại access token mới — đây là thiết kế đúng và chuẩn.

Tuy nhiên, kiểm tra header response của `POST /auth/login`:

```
Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Lax
```

Cookie đang được set với **`SameSite=Lax`**. Với cookie `SameSite=Lax`, trình duyệt **chỉ gửi kèm cookie khi điều hướng trang (top-level navigation) cùng site**, và **KHÔNG gửi kèm** trong các request nền (`fetch`/`XHR`) nếu request đó là **cross-site** — mà toàn bộ API call của FE (bao gồm `/auth/refresh`) đều là `fetch`/`XHR` cross-site vì FE và BE khác domain.

→ Kết quả: cookie `refresh_token` không bao giờ được trình duyệt gửi lên trong lúc gọi `/auth/refresh` từ FE, nên backend luôn thấy "không có refresh token", trả về 401.

## Đề xuất fix (phía backend)

Đổi thuộc tính cookie khi set `refresh_token` (và mọi cookie auth khác dùng cho cross-site request) từ:

```
SameSite=Lax
```

sang:

```
SameSite=None; Secure
```

Lưu ý:
- `SameSite=None` **bắt buộc phải đi kèm `Secure`** (cookie chỉ gửi qua HTTPS) — hiện tại cookie đã có `Secure` rồi nên chỉ cần đổi `SameSite`.
- CORS phía backend cần đảm bảo (thường đã đúng, kiểm tra lại):
  - `Access-Control-Allow-Credentials: true` (đã thấy có trong response — OK)
  - `Access-Control-Allow-Origin` trả **đúng origin cụ thể** của FE (không được là `*` khi dùng credentials).

## Cách verify sau khi backend fix

```bash
curl -si -X POST https://japanesestorebe.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Thanh@123"}' | grep -i set-cookie
```

Kỳ vọng thấy: `SameSite=None; Secure` thay vì `SameSite=Lax`.

Sau đó test lại trên Admin: đăng nhập → F5 nhiều lần → không còn bị văng ra login / không còn lỗi "No refresh token".

## Ghi chú

Đây là vấn đề cấu hình ở **backend** (nơi set cookie), phía frontend admin không có cách nào tự sửa được vì đây là hành vi bảo mật cookie do trình duyệt kiểm soát dựa trên header response từ server.
