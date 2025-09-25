# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["XEdu.Api/XEdu.Api.csproj", "XEdu.Api/"]
COPY ["XEdu.Core/XEdu.Core.csproj", "XEdu.Core/"]
COPY ["XEdu.Infrastructure/XEdu.Infrastructure.csproj", "XEdu.Infrastructure/"]
RUN dotnet restore "XEdu.Api/XEdu.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/XEdu.Api"
RUN dotnet build "XEdu.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "XEdu.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create a non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "XEdu.Api.dll"]