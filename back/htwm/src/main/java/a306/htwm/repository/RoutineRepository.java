package a306.htwm.repository;

import a306.htwm.entity.Mirror;
import a306.htwm.entity.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.Optional;

public interface RoutineRepository extends JpaRepository<Routine, Long> {
    @Query(nativeQuery = true, value = "select * from routine r " +
            "join user u " +
            "on r.user_id = u.user_id " +
            "where r.name = :name and u.username = :username")
    Optional<Routine> findByNameAndUsername(@Param("name") String name,@Param("username") String username);

    boolean existsByName(String name);

    @Query(nativeQuery = true, value = "select * from routine where name = :name")
    Routine findByName(@Param("name") String name);

    @Query(nativeQuery = true, value = "select * from routine r " +
            "join user u on r.user_id = u.user_id " +
            "where u.username = :username")
    ArrayList<Routine> findAllByUsername(@Param("username") String username);
}
