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
import org.springframework.http.ResponseEntity;
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
        Mirror mirror = mirrorRepository.findByUuid(registerDTO.getUuid());
        if(mirror==null){
            throw new RuntimeException("uuid 가 존재하지 않습니다.");
        }
        mirror.setUser(user);
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

    public ArrayList<FriendDTO> searchFriend(String string){
        ArrayList<User> users = userRepository.findByString(string);
        ArrayList<FriendDTO> friendInfoDTOS = new ArrayList<>();
        for(User user : users){
            FriendDTO friendInfoDTO = FriendDTO.builder()
                    .nickname(user.getNickname())
                    .username(user.getUsername())
                    .url(user.getImgUrl())
                    .build();
            friendInfoDTOS.add(friendInfoDTO);
        }
        return friendInfoDTOS;
    }

    public String getUuid(String username){
        return mirrorRepository.findByUser(userRepository.findByUsername(username).getId()).getUuid();
    }

    public String getUsernameByUuid(String uuid) {
        return mirrorRepository.findByUuid(uuid).getUser().getUsername();
    }

    @Transactional
    public String login(LoginDTO loginDTO) {
        User user = userRepository.findByUsername(loginDTO.getUsername());
        if(user == null){
            User newUser = new User();
            newUser.setUsername(loginDTO.getUsername());
            newUser.setNickname(loginDTO.getNickname());
            newUser.setImgUrl(loginDTO.getUrl());
            userRepository.save(newUser);
            return "new user";
        }
        else{
            return "login";
        }
    }

    @Transactional
    public void height(HeightDTO heightDTO) {
        User user = userRepository.findByUsername(heightDTO.getUsername());
        if(user == null) throw new RuntimeException("no such user");
        user.setHeight(heightDTO.getHeight());
    }

    public UserInfoDTO info(String username) {
        User user = userRepository.findByUsername(username);
        if(user == null) throw new RuntimeException("no such user");
        UserInfoDTO ret = UserInfoDTO.builder()
                .height(user.getHeight())
                .url(user.getImgUrl())
                .nickname(user.getNickname())
                .build();
        return ret;
    }
}
