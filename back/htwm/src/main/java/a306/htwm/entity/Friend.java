package a306.htwm.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "friend")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Friend {

    @Id
    @Column(name = "friend_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "my_id")
    private User myId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "other_id")
    private User otherId;
}
