from fastapi import HTTPException, Request, status
from firebase_admin import auth


def get_authorization_token(request: Request) -> str:
    token = request.headers.get("Authorization") or request.headers.get("authorization")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token is required.",
        )

    if token.lower().startswith("bearer "):
        return token.split(" ", 1)[1]

    return token


def get_authenticated_user_id(request: Request) -> str:
    token = get_authorization_token(request)

    try:
        user = auth.verify_id_token(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authorization token.",
        ) from exc

    return user["uid"]
