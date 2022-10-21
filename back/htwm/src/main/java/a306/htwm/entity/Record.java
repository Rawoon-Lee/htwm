package a306.htwm.entity;


import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "record")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Record {

    @Id
    @Column(name = "record_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private int DoneSetNum; // 진행률
    private String routineString;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
