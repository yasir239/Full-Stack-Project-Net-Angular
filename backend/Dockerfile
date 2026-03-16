# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files for restore
COPY StudentRegistration.sln .
COPY StudentRegistration.Domain/StudentRegistration.Domain.csproj StudentRegistration.Domain/
COPY StudentRegistration.Infrastructure/StudentRegistration.Infrastructure.csproj StudentRegistration.Infrastructure/
COPY StudentRegistration.Application/StudentRegistration.Application.csproj StudentRegistration.Application/
COPY StudentRegistration.API/StudentRegistration.API.csproj StudentRegistration.API/

# Restore dependencies
RUN dotnet restore

# Copy all source code
COPY . .

# Build and publish
WORKDIR /src/StudentRegistration.API
RUN dotnet publish -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "StudentRegistration.API.dll"]
