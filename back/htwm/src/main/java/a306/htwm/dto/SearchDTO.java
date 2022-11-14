package a306.htwm.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchDTO {
    private String username;
    private String nickname;
    private String url;
    private int status;
}
