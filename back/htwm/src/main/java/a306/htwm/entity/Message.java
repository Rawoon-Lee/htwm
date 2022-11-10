package a306.htwm.entity;

import lombok.*;

@Getter @Builder @Setter
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private String type;
    private String from;
    private String to;
    private String nickname;
    private String url;
    private String data;
}
