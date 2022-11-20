package a306.htwm.dto;

import lombok.*;

@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendDTO {
    private String username;
    private String nickname;
    private String url;
    private String phoneId;
}
