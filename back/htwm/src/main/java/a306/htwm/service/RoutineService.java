package a306.htwm.service;

import a306.htwm.dto.*;
import a306.htwm.entity.Exercise;
import a306.htwm.entity.Friend;
import a306.htwm.entity.Routine;
import a306.htwm.entity.Set;
import a306.htwm.repository.ExerciseRepository;
import a306.htwm.repository.RoutineRepository;
import a306.htwm.repository.SetRepository;
import a306.htwm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class RoutineService {

    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final RoutineRepository routineRepository;
    private final SetRepository setRepository;

    public ArrayList<ExerciseDTO> getExercise() {
        ArrayList<Exercise> exercises = exerciseRepository.findAll();
        ArrayList<ExerciseDTO> exerciseDTOS = new ArrayList<>();
        for(Exercise exercise : exercises){
            ExerciseDTO exerciseDTO = ExerciseDTO.builder()
                    .exercise_id(exercise.getId())
                    .name(exercise.getName())
                    .url(exercise.getUrl())
                    .build();
            exerciseDTOS.add(exerciseDTO);
        }
        return exerciseDTOS;
    }

    @Transactional
    public void create(CreateRoutineDTO createRoutineDTO){
        // 루틴 생성
        Routine routine = new Routine();
        if(routineRepository.findByNameAndUsername(createRoutineDTO.getName(), createRoutineDTO.getUsername()).isPresent()){
            throw new RuntimeException("중복된 루틴명입니다.");
        }
        routine.setName(createRoutineDTO.getName());
        routine.setUser(userRepository.findByUsername(createRoutineDTO.getUsername()));
        routineRepository.save(routine);

        // 세트 생성
        ArrayList<SetDTO> setDTOS = createRoutineDTO.getSets();
        for(SetDTO setDTO : setDTOS){
            Set set = new Set();
            Long exerciseId = setDTO.getExercise_id();
            if(exerciseId == 0f) set.setExercise(null); // 0 일때 휴식으로 예외 처리
            else set.setExercise(exerciseRepository.findById(exerciseId).get());
            set.setSet_cnt(setDTO.getSet_cnt());
            set.setNumber(setDTO.getNumber());
            set.setTime(set.getTime());
            set.setRoutine(routine);
            setRepository.save(set);
        }
    }

    @Transactional
    public void delete(DeleteRoutineDTO deleteRoutineDTO){
        if(routineRepository.findByNameAndUsername(deleteRoutineDTO.getName(), deleteRoutineDTO.getUsername()).isEmpty()){
            throw new RuntimeException("루틴 명이 존재하지 않습니다.");
        }
        // 연관된 세트 삭제
        Routine routine = routineRepository.findByNameAndUsername(deleteRoutineDTO.getName(), deleteRoutineDTO.getUsername()).get();

        for(Set set : setRepository.findAllByRoutine(routine.getId())){
            setRepository.delete(set);
        }

        // 해당 루팅 삭제
        routineRepository.delete(routine);
    }
}
