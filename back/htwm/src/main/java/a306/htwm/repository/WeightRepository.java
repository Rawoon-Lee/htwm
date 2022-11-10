package a306.htwm.repository;

import a306.htwm.entity.User;
import a306.htwm.entity.Weight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.Optional;

public interface WeightRepository extends JpaRepository<Weight, Long> {

    @Query(nativeQuery = true, value = "select * from weight w " +
            "join user u " +
            "on w.user_id = u.user_id " +
            "where w.date = :date and u.username = :username")
    Optional<Weight> findByUsernameAndDate(@Param("username") String username, @Param("date") String date);

    @Query(nativeQuery = true, value = "select * from weight w " +
            "join user u " +
            "on w.user_id = u.user_id " +
            "where u.username = :username " +
            "order by w.date")
    ArrayList<Weight> findByUsernameOrderByDate(@Param("username") String username);
}
