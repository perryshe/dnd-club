using tic_tac.domain.model;

namespace tic_tac.web.mapper;

public interface IGameWebMapper
{
    web.model.GameDto ToDto(Game game, Guid? currentUserId = null);
}