using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using tic_tac.domain.service;

namespace tic_tac.web.auth;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class UserAuthenticator : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var authService = context.HttpContext.RequestServices
            .GetRequiredService<IAuthService>();

        var userId = authService.AuthorizeAsync(context.HttpContext.Request)
            .GetAwaiter().GetResult();

        if (userId == null)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        context.HttpContext.Items["UserId"] = userId.Value;
    }
}