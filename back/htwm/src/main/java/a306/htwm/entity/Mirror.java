package a306.htwm.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mirror")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Mirror {

    @Id
    @Column(name = "mirror_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "uuid", unique = true)
    private String uuid;

    @OneToMany(mappedBy = "mirror")
    private List<User> users = new ArrayList<>();
}
