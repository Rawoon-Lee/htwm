package a306.htwm.repository;

import a306.htwm.entity.Mirror;
import a306.htwm.entity.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SetRepository extends JpaRepository<Set, Long> {

    @Query(nativeQuery = true, value = "select * from sets where routine_id = :id")
    List<Set> findAllByRoutine(@Param("id") Long id);
}
