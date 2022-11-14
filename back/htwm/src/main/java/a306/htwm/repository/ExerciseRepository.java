package a306.htwm.repository;

import a306.htwm.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    @Query(nativeQuery=true, value = "select * from exercise")
    ArrayList<Exercise> findAll();
}
