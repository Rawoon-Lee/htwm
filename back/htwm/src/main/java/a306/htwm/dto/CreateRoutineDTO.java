package a306.htwm.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter @Setter
public class CreateRoutineDTO {
    private String username;
    private String name;
    private ArrayList<SetDTO> sets;
    private String color;
}
