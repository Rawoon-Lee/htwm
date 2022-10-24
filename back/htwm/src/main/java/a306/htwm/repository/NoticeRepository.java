package a306.htwm.repository;

import a306.htwm.entity.Mirror;
import a306.htwm.entity.Notice;
import a306.htwm.entity.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @Query(nativeQuery = true,value = "select * from notice " +
            "where from_id = :fromId and to_id = :toId and type = :type")
    Optional<Notice> findByFromIdAndToIdIfType(@Param("fromId") Long fromId, @Param("toId") Long toId,@Param("type") String type);

    @Query(nativeQuery = true, value = "select * from notice " +
            "where to_id = :userId")
    ArrayList<Notice> findAllByToId(@Param("userId") Long userId);
}
