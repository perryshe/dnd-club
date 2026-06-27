using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using tic_tac.domain.service;

namespace tic_tac.web.auth;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class UserAuthenticator : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (context.ActionDescriptor.EndpointMetadata
            .Any(m => m.GetType() == typeof(AllowAnonymousAttribute)))
        {
            return;
        }

        var authHeader = context.HttpContext.Request.Headers.Authorization.FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic "))
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        string base64Credentials;
        try
        {
            base64Credentials = authHeader["Basic ".Length..].Trim();
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(base64Credentials));
            var parts = decoded.Split(':', 2);
            if (parts.Length != 2)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();
            var userId = userService.Authorize(parts[0], parts[1]);
            if (userId == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            context.HttpContext.Items["UserId"] = userId.Value;
            context.HttpContext.Items["UserLogin"] = parts[0];
        }
        catch
        {
            context.Result = new UnauthorizedResult();
        }
    }
}
