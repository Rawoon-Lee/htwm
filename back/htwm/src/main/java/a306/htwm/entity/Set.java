package a306.htwm.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "set")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Set {

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
}
