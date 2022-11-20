package a306.htwm.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sets")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Sets {

    @Id
    @Column(name = "set_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int time;
    private int number;
    private int set_cnt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    // routine_set
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id")
    private Routine routine;
}
