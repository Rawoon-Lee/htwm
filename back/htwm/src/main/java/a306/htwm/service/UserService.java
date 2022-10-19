package a306.htwm.service;

import a306.htwm.dto.EditDTO;
import a306.htwm.dto.RegisterDTO;
import a306.htwm.dto.WeightDTO;
import a306.htwm.entity.Mirror;
import a306.htwm.entity.User;
import a306.htwm.entity.Weight;
import a306.htwm.repository.MirrorRepository;
import a306.htwm.repository.UserRepository;
import a306.htwm.repository.WeightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.DateFormatter;
import java.text.DateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Optional;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MirrorRepository mirrorRepository;
    private final WeightRepository weightRepository;

    @Transactional
    public void register(RegisterDTO registerDTO) {
        User user = userRepository.findByUsername(registerDTO.getUsername());
        Mirror mirror = mirrorRepository.findByUuid(registerDTO.getUuid());
        user.setMirror(mirror);
    }

    @Transactional
    public void edit(EditDTO editDTO) {
        User user = userRepository.findByUsername(editDTO.getUsername());
        user.setNickname(editDTO.getNickname());
        user.setHeight(editDTO.getHeight());
    }

    @Transactional
    public void weight(WeightDTO weightDTO) {
        // 반정규화 진행으로 인한 user 검색 불필요 : test 완료 시 주석 삭제 필요
        // User user = userRepository.findByUsername(weightDTO.getUsername());

        LocalDate now = LocalDate.now(ZoneId.of("Asia/Seoul"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        String todayDate = now.format(formatter);

        Optional<Weight> weight = weightRepository.findByUsernameAndDate(weightDTO.getUsername(),todayDate);
        if(weight.isPresent()){
            weight.get().setWeight(weightDTO.getWeight());
        }else{
            User user = userRepository.findByUsername(weightDTO.getUsername());

            Weight newWeight = new Weight();
            newWeight.setWeight(weightDTO.getWeight());
            newWeight.setDate(todayDate);
            newWeight.setUser(user);
            // username 함께 update 되는지 test 필요
            weightRepository.save(newWeight);
        }
    }
}
