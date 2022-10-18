package a306.htwm.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "routine")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Routine {

    @Id
    @Column(name = "routine_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
