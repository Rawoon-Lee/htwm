package a306.htwm.repository;

import a306.htwm.entity.Mirror;
import a306.htwm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MirrorRepository extends JpaRepository<Mirror, Long> {

    Mirror findByUuid(String uuid);

    Mirror findByUser(Long userId);
}
