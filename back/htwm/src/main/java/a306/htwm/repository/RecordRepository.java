package a306.htwm.repository;

import a306.htwm.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface RecordRepository extends JpaRepository<Record, Long> {
    @Query(nativeQuery = true, value = "select * from record " +
            "where user_id = :userId")
    ArrayList<Record> findAllByUserId(@Param("userId") Long userId);

    @Query(nativeQuery = true, value = "select distinct cast(end_datetime as date) dates from record " +
            "where user_id = :userId " +
            "order by dates desc")
    ArrayList<String> getDates(@Param("userId") Long id);
}
