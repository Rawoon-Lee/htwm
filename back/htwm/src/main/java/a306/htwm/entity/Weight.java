package a306.htwm.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "weight")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Weight {

    @Id
    @Column(name = "weight_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double weight;

    private String date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    //반정규화 진행 -> test 필요
    private String username = user.getUsername();
}
