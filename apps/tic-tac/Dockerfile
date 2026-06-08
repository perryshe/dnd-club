FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["apps/tic-tac/tic_tac/tic_tac.csproj", "apps/tic-tac/tic_tac/"]
RUN dotnet restore "apps/tic-tac/tic_tac/tic_tac.csproj"
COPY . .
RUN dotnet publish "apps/tic-tac/tic_tac/tic_tac.csproj" -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENTRYPOINT ["dotnet", "tic_tac.dll"]
