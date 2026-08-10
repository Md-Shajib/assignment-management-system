# ============================================
# Assignment Management System - Backend image
# Build from the repo root with:
#   docker build -t assignment-backend -f backend/deployment/Dockerfile backend
# ============================================

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Restore first to leverage Docker layer caching.
COPY AssignmentManagement.Api.csproj .
RUN dotnet restore AssignmentManagement.Api.csproj

# Copy the rest of the source and publish.
COPY . .
RUN dotnet publish AssignmentManagement.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# aspnet images ship a non-root "app" user (UID 1654).
USER $APP_UID

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "AssignmentManagement.Api.dll"]