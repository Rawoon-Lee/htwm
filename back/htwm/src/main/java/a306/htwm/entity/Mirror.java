package a306.htwm.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mirror")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Mirror {

    @Id
    @Column(name = "mirror_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "uuid", unique = true)
    private String uuid;

    //mirror
    @ManyToOne // 외래키가 있는 곳이 연관관계의 주인
    @JoinColumn(name = "user_id")
    private User user;
}
