package a306.htwm.entity;


import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "streaming")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class Streaming {

    @Id
    @Column(name = "streaming_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "my_id")
    private User myId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "other_id")
    private User otherId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
