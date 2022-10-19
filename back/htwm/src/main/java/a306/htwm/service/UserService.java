package a306.htwm.service;

import a306.htwm.dto.EditDTO;
import a306.htwm.dto.FriendDTO;
import a306.htwm.dto.RegisterDTO;
import a306.htwm.dto.WeightDTO;
import a306.htwm.entity.Friend;
import a306.htwm.entity.Mirror;
import a306.htwm.entity.User;
import a306.htwm.entity.Weight;
import a306.htwm.repository.FriendRepository;
import a306.htwm.repository.MirrorRepository;
import a306.htwm.repository.UserRepository;
import a306.htwm.repository.WeightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.DateFormatter;
import javax.swing.text.html.Option;
import java.text.DateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MirrorRepository mirrorRepository;
    private final WeightRepository weightRepository;
    private final FriendRepository friendRepository;

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
            weightRepository.save(newWeight);
        }
    }

    public void acceptFriend(FriendDTO friendDTO) {
        Optional<Friend> friend = friendRepository.findByMyNameAndFriendName(friendDTO.getUsername(), friendDTO.getFriendname());
        if(friend.isPresent()){
            throw new RuntimeException("이미 친구입니다.");
        }else{
            Friend newFriend = new Friend();
            newFriend.setMyId(userRepository.findByUsername(friendDTO.getUsername()));
            newFriend.setOtherId(userRepository.findByUsername(friendDTO.getFriendname()));
            friendRepository.save(newFriend);
        }
    }

    public void deleteFriend(FriendDTO friendDTO) {
        Optional<Friend> friend = friendRepository.findByMyNameAndFriendName(friendDTO.getUsername(), friendDTO.getFriendname());
        if(friend.isPresent()){

        }else{
            throw new RuntimeException("이미 친구가 아닙니다.");
        }
    }

    public ArrayList<Friend> getFriend(FriendDTO friendDTO) {
        return friendRepository.findAllByUsername(friendDTO.getUsername());
    }

}
