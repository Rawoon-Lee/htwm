package a306.htwm.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter  @Setter
public class RecordRoutineDTO {
    private String username;
    private int doneSetNum;
    private LocalDateTime StartDateTime;
    private LocalDateTime EndDateTime;
    private String routineJson;
}
