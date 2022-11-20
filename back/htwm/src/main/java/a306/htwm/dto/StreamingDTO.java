package a306.htwm.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@AllArgsConstructor
@NoArgsConstructor
public class StreamingDTO {
    private String otherUsername;
    private String otherNickname;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
