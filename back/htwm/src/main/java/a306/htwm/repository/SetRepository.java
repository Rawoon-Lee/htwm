package a306.htwm.repository;

import a306.htwm.entity.Sets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SetRepository extends JpaRepository<Sets, Long> {

    @Query(nativeQuery = true, value = "select * from sets where routine_id = :id")
    List<Sets> findAllByRoutine(@Param("id") Long id);
}
