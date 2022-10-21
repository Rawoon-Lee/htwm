package a306.htwm.repository;

import a306.htwm.entity.Mirror;
import a306.htwm.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @Query(nativeQuery = true,value = "select * from notice " +
            "where from_id = :fromId and to_id = :toId and type = 0")
    Optional<Notice> findByFromIdAndToIdIfFriend(@Param("fromId") Long fromId, @Param("toId") Long toId);

    @Query(nativeQuery = true,value = "select * from notice " +
            "where from_id = :fromId and to_id = :toId and type = 1")
    Optional<Notice> findByFromIdAndToIdIfStreaming(@Param("fromId") Long fromId, @Param("toId") Long toId);

    @Query(nativeQuery = true, value = "select * from notice " +
            "where to_id = :userId")
    ArrayList<Notice> findAllByToId(@Param("userId") Long userId);
}
