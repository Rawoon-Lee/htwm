package a306.htwm.repository;

import a306.htwm.entity.Streaming;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.Optional;

public interface StreamingRepository extends JpaRepository<Streaming, Long> {
    @Query(nativeQuery = true,value = "select * from streaming " +
            "where my_id = :toId and other_id = :fromId " +
            "order by end_time desc limit 1")
    Optional<Streaming> findLastOneByPlayers(@Param("toId") Long userId,@Param("fromId") Long friendId);

    @Query(nativeQuery = true, value = "select * from streaming " +
            "where my_id = :userId")
    ArrayList<Streaming> findAllByUserId(Long userId);
}
