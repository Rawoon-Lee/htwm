package a306.htwm.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "notice")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Notice {

    @Id
    @Column(name = "notice_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_id")
    private User fromId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_id")
    private User toId;

    @Enumerated(EnumType.STRING)
    private Type type;

    private LocalDateTime createTime;

    private boolean isread;
}
