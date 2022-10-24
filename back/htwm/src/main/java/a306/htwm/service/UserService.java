package a306.htwm.service;

import a306.htwm.dto.*;
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

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
        if(user == null) throw new RuntimeException("username 이 존재하지 않습니다.");
        Optional<Mirror> mirror = mirrorRepository.findByUuid(registerDTO.getUuid());
        if(mirror.isEmpty()){
            throw new RuntimeException("uuid 가 존재하지 않습니다.");
        }
        user.setMirror(mirror.get());
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

    @Transactional
    public void acceptFriend(UsernameAndFriendDTO usernameAndFriendDTO) {
        Optional<Friend> friend = friendRepository.findByMyNameAndFriendName(usernameAndFriendDTO.getUsername(), usernameAndFriendDTO.getFriendname());
        if(friend.isPresent()){
            throw new RuntimeException("이미 친구입니다.");
        }else{
            Friend newFriend = new Friend();
            newFriend.setMyId(userRepository.findByUsername(usernameAndFriendDTO.getUsername()));
            newFriend.setOtherId(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()));

            Friend newFriend2 = new Friend();
            newFriend2.setMyId(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()));
            newFriend2.setOtherId(userRepository.findByUsername(usernameAndFriendDTO.getUsername()));

            friendRepository.save(newFriend);
            friendRepository.save(newFriend2);
        }
    }

    @Transactional
    public void deleteFriend(UsernameAndFriendDTO usernameAndFriendDTO) {
        Optional<Friend> friend = friendRepository.findByMyNameAndFriendName(usernameAndFriendDTO.getUsername(), usernameAndFriendDTO.getFriendname());
        if(friend.isPresent()){
            friendRepository.deleteById(friend.get().getId());

            Optional<Friend> friend2 = friendRepository.findByMyNameAndFriendName(usernameAndFriendDTO.getFriendname(), usernameAndFriendDTO.getUsername());
            friendRepository.deleteById(friend2.get().getId());
        }else{
            throw new RuntimeException("이미 친구가 아닙니다.");
        }
    }

    public ArrayList<FriendDTO> getFriend(String username) {
        if(userRepository.findByUsername(username) == null) throw new RuntimeException("username 이 존재하지 않습니다.");
        ArrayList<Friend> friends = friendRepository.findAllByUsername(username);
        ArrayList<FriendDTO> friendDTOS = new ArrayList<>();
        for(Friend friend : friends){
            FriendDTO friendDTO = FriendDTO.builder()
                    .username(friend.getOtherId().getUsername())
                    .nickname(friend.getOtherId().getNickname())
                    .build();
            friendDTOS.add(friendDTO);
        }
        return friendDTOS;
    }

    public String getUuid(String username){
        return userRepository.findByUsername(username).getMirror().getUuid();
    }
}
