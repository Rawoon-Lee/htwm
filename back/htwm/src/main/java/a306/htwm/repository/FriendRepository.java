package a306.htwm.repository;

import a306.htwm.entity.Friend;
import a306.htwm.entity.Mirror;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long> {

    // 수정 필요 -> test 필요 해야함
    @Query(nativeQuery = true, value = "select * from friend f join user u " +
            "on f.my_id := u.user_id and f.other_id := u.user_id " +
            "where ")
    Optional<Friend> findByMyNameAndFreindName(@Param("myname") String myname, @Param("friendname") String friendname);

    @Query(nativeQuery = true, value = "select * from friend f join user u " +
            "on f.my_id := u.user_id " +
            "where u.username := username")
    ArrayList<Friend> findAllByUsername(@Param("username") String username);
}
