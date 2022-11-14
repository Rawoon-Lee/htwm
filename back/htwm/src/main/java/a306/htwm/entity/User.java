package a306.htwm.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "height")
    private double height;

    @Column(name = "img_url")
    private String imgUrl;

    @Column(name="phone_id")
    private String phoneId;

    /* 연관관계 매핑 */

    //mirror
    @OneToMany(mappedBy = "user")
    private List<Mirror> mirrors = new ArrayList<>();

    //친구 목록
    @OneToMany(mappedBy = "myId")
    private List<Friend> myIds_f = new ArrayList<>();

    @OneToMany(mappedBy = "otherId")
    private List<Friend> otherIds_f = new ArrayList<>();

    // 알림
    @OneToMany(mappedBy = "fromId")
    private List<Notice> fromIds = new ArrayList<>();

    @OneToMany(mappedBy = "toId")
    private List<Notice> toIds = new ArrayList<>();

    // 스트리밍
    @OneToMany(mappedBy = "myId")
    private List<Streaming> myIds_s = new ArrayList<>();

    @OneToMany(mappedBy = "otherId")
    private List<Streaming> otherIds_s = new ArrayList<>();

    // weight
    @OneToMany(mappedBy = "user")
    private List<Weight> weights = new ArrayList<>();

    // picture
    @OneToMany(mappedBy = "user")
    private List<Picture> pics = new ArrayList<>();

    // Record
    @OneToMany(mappedBy = "user")
    private List<Record> records = new ArrayList<>();

    // Routine
    @OneToMany(mappedBy = "user")
    private List<Routine> routines = new ArrayList<>();

}
