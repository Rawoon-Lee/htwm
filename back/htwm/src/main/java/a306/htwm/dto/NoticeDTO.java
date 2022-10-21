package a306.htwm.dto;

import a306.htwm.entity.Type;
import lombok.*;

import java.time.LocalDateTime;

@Setter @Getter @Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticeDTO {
    private LocalDateTime createTime;
    private String fromUsername;
    private String toUsername;
    private boolean isRead;
    private Type type;
}
