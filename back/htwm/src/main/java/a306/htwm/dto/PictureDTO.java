package a306.htwm.dto;

import lombok.*;
import org.joda.time.DateTime;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PictureDTO {
    private LocalDateTime date;
    private String url;
}
