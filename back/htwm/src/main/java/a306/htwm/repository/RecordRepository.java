package a306.htwm.repository;

import a306.htwm.entity.Picture;
import a306.htwm.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordRepository extends JpaRepository<Record, Long> {
}
