package a306.htwm.dto;

import lombok.*;

@Setter @Getter @Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDTO {
    private String nickname;
    private String url;
    private double height;
}
