package a306.htwm.repository;

import a306.htwm.entity.Mirror;
import a306.htwm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MirrorRepository extends JpaRepository<Mirror, Long> {

    @Query(nativeQuery = true, value = "select * from mirror " +
            "where uuid = :uuid")
    Mirror findByUuid(@Param("uuid") String uuid);

    @Query(nativeQuery = true, value = "select * from mirror " +
            "where user_id = :userId")
    Mirror findByUser(@Param("userId") Long userId);
}
