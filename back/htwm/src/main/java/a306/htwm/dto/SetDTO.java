package a306.htwm.dto;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class SetDTO {
    private Long exercise_id;
    private int set_cnt; //몇세트 할것인지
    private int number; // 한세트당 몇번 할것인지
    private int sec; // 한세트당 몇 초 할것인지
}
