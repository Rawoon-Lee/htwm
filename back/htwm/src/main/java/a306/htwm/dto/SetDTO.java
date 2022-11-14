package a306.htwm.dto;

import lombok.*;

@Setter @Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SetDTO {
    private Long exercise_id;
    private String exercise_name;
    private String url;
    private int set_cnt; //몇세트 할것인지
    private int number; // 한세트당 몇번 할것인지
    private int sec; // 한세트당 몇 초 할것인지
}
