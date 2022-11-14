package a306.htwm.dto;

import lombok.*;

import java.util.ArrayList;

@Getter @Setter @Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoutineDTO {
    private String username;
    private String name;
    private String color;
    private ArrayList<SetDTO> sets;
}
