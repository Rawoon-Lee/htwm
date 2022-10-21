package a306.htwm.dto;

import lombok.*;

@Setter @Getter @Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExerciseDTO {
    private Long exercise_id;
    private String name;
    private String url;
}
