# Backend Security

Rules:

- Authenticate requests using JWT.
- Authorize access using role-based authorization.
- Never store plain-text passwords.
- Hash passwords using a secure algorithm.
- Never expose secrets or connection strings.
- Read configuration from environment variables.
- Validate and sanitize all external input.
- Never trust client-provided data.
- Do not leak sensitive information in error responses.
- Apply the principle of least privilege.
