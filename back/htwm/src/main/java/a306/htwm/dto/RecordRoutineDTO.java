package a306.htwm.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter  @Setter @Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecordRoutineDTO {
    private String username;
    private int doneSetNum;
    private LocalDateTime StartDateTime;
    private LocalDateTime EndDateTime;
    private String routineJson;
}
