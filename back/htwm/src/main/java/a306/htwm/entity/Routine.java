package a306.htwm.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // routine_set
    @OneToMany(mappedBy = "routine")
    private List<Sets> sets = new ArrayList<>();
}
